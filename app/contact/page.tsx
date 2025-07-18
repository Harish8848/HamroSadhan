import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Phone, Mail, MapPin, Clock, MessageCircle, Send } from "lucide-react"
import { Footer } from "@/components/footer"

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Hero Section */}
      <section className="py-20 px-4 md:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <Badge variant="secondary" className="mb-4 text-sm font-medium">
            Get In Touch
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Contact <span className="text-blue-600">HamroSadhan</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Have questions about our rental services? Need help planning your trip? We're here to assist you 24/7. Reach
            out to us anytime!
          </p>
        </div>
      </section>

      {/* Contact Form & Info */}
      <section className="py-16 px-4 md:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                  <MessageCircle className="h-6 w-6 text-blue-600" />
                  Send us a Message
                </CardTitle>
                <p className="text-gray-600">Fill out the form below and we'll get back to you within 24 hours.</p>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input id="firstName" placeholder="Enter your first name" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input id="lastName" placeholder="Enter your last name" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input id="email" type="email" placeholder="your.email@example.com" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input id="phone" type="tel" placeholder="+977 98XXXXXXXX" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="subject">Subject</Label>
                  <Input id="subject" placeholder="What can we help you with?" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">Message</Label>
                  <Textarea
                    id="message"
                    placeholder="Tell us more about your rental needs, travel dates, or any questions you have..."
                    rows={5}
                  />
                </div>

                <Button className="w-full text-lg py-3" size="lg">
                  <Send className="h-5 w-5 mr-2" />
                  Send Message
                </Button>
              </CardContent>
            </Card>

            {/* Contact Information */}
            <div className="space-y-8">
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="text-2xl font-bold text-gray-900">Contact Information</CardTitle>
                  <p className="text-gray-600">Multiple ways to reach us. Choose what works best for you.</p>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-blue-100 rounded-lg">
                      <Phone className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">Phone</h3>
                      <p className="text-gray-600">+977 9868795658</p>
                      <p className="text-gray-600">+977 9812709474</p>
                      <p className="text-sm text-gray-500 mt-1">Available 24/7 for emergencies</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-green-100 rounded-lg">
                      <Mail className="h-6 w-6 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">Email</h3>
                      <p className="text-gray-600">info@hamrosadhan.com</p>
                      <p className="text-gray-600">support@hamrosadhan.com</p>
                      <p className="text-sm text-gray-500 mt-1">We respond within 2-4 hours</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-purple-100 rounded-lg">
                      <MapPin className="h-6 w-6 text-purple-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">Office Address</h3>
                      <p className="text-gray-600">Mahendranagar, Kanchanpur</p>
                      <p className="text-gray-600">Nepal - 10400</p>
                      <p className="text-sm text-gray-500 mt-1">Visit us for in-person assistance</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-orange-100 rounded-lg">
                      <Clock className="h-6 w-6 text-orange-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">Business Hours</h3>
                      <p className="text-gray-600">Monday - Friday: 10:00 AM - 7:00 PM</p>
                      <p className="text-gray-600">Saturday - Sunday: 10:00 AM - 5:00 PM</p>
                      <p className="text-sm text-gray-500 mt-1">Emergency support available 24/7</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Contact Cards */}
              <div className="grid gap-4">
                <Card className="p-6 bg-gradient-to-r from-blue-500 to-blue-600 text-white">
                  <h3 className="font-semibold mb-2">Emergency Assistance</h3>
                  <p className="text-blue-100 mb-3">Need immediate help during your rental?</p>
                  <Button variant="secondary" size="sm">
                    Call Emergency Line
                  </Button>
                </Card>

                <Card className="p-6 bg-gradient-to-r from-green-500 to-green-600 text-white">
                  <h3 className="font-semibold mb-2">WhatsApp Support</h3>
                  <p className="text-green-100 mb-3">Quick responses via WhatsApp</p>
                  <Button variant="secondary" size="sm">
                    Chat on WhatsApp
                  </Button>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Location Section */}
      <section className="py-16 px-4 md:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Locations</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              We serve major cities across Nepal. Find the nearest location to you.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center p-6">
              <div className="p-3 bg-blue-100 rounded-full w-12 h-12 mx-auto mb-4 flex items-center justify-center">
                <MapPin className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Kathmandu</h3>
              <p className="text-gray-600 text-sm mb-3">Thamel, New Road, Durbar Marg</p>
              <Badge variant="secondary">Main Hub</Badge>
            </Card>

            <Card className="text-center p-6">
              <div className="p-3 bg-green-100 rounded-full w-12 h-12 mx-auto mb-4 flex items-center justify-center">
                <MapPin className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Pokhara</h3>
              <p className="text-gray-600 text-sm mb-3">Lakeside, Mahendrapul</p>
              <Badge variant="secondary">Tourist Hub</Badge>
            </Card>

            <Card className="text-center p-6">
              <div className="p-3 bg-purple-100 rounded-full w-12 h-12 mx-auto mb-4 flex items-center justify-center">
                <MapPin className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Chitwan</h3>
              <p className="text-gray-600 text-sm mb-3">Sauraha, Bharatpur</p>
              <Badge variant="secondary">Adventure Base</Badge>
            </Card>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 px-4 md:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
            <p className="text-lg text-gray-600">Quick answers to common questions about our rental services.</p>
          </div>

          <div className="space-y-6">
            <Card className="p-6">
              <h3 className="font-semibold text-gray-900 mb-2">What documents do I need to rent a vehicle?</h3>
              <p className="text-gray-600">
                You'll need a valid driving license, citizenship certificate or passport, and a security deposit.
                International visitors need an International Driving Permit.
              </p>
            </Card>

            <Card className="p-6">
              <h3 className="font-semibold text-gray-900 mb-2">Do you provide fuel?</h3>
              <p className="text-gray-600">
                Vehicles are provided with a full tank. You're responsible for fuel during your rental period and should
                return the vehicle with the same fuel level.
              </p>
            </Card>

            <Card className="p-6">
              <h3 className="font-semibold text-gray-900 mb-2">What&apos;s included in the rental price?</h3>
              <p className="text-gray-600">
                Basic insurance, 24/7 roadside assistance, GPS navigation (for cars), and safety gear (for bikes) are
                included. Additional insurance options are available.
              </p>
            </Card>
          </div>
        </div>
      </section>
    <Footer />
    </div>
  )
}
